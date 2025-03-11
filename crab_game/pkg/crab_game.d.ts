/* tslint:disable */
/* eslint-disable */
export function log_to_proof_area(message: string): void;
export function show_sp1_proof_result(success: boolean, hash: string): void;
export enum GameState {
  NotStarted = 0,
  Playing = 1,
  Paused = 2,
  GameOver = 3,
}
export class GameManager {
  private constructor();
  free(): void;
  static new(canvas: HTMLCanvasElement, crab_img: HTMLImageElement, crab_shield_img: HTMLImageElement, crab_double_img: HTMLImageElement, yellow_star_img: HTMLImageElement, pink_star_img: HTMLImageElement, purple_star_img: HTMLImageElement, rock_img: HTMLImageElement, shield_img: HTMLImageElement, double_points_img: HTMLImageElement, extra_life_img: HTMLImageElement, slowdown_img: HTMLImageElement, star_sound: HTMLAudioElement, rock_sound: HTMLAudioElement, shield_hit_sound: HTMLAudioElement): GameManager;
  handle_key_press(event: KeyboardEvent): void;
  start(): void;
  stop(): void;
  restart(): void;
  update(delta_time: number): boolean;
  get_score(): number;
  get_lives(): number;
  is_game_over(): boolean;
  get_game_state(): GameState;
  set_sound_enabled(enabled: boolean): void;
  get_yellow_stars_count(): number;
  get_pink_stars_count(): number;
  get_purple_stars_count(): number;
  get_game_time(): number;
  show_sp1_proof_interface(): void;
  hide_sp1_proof_interface(): void;
}
